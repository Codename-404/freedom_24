import jwt from "@tsndr/cloudflare-worker-jwt";
import { D1Orm } from "d1-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import { makeQueryStringUrl } from "@/util/data";
import { getServerHost } from "@/util/serverUtilFunc";
import { UserModel } from "@/db/models";
import { getDB } from "@/db/getDB";

export const runtime = "edge";

export async function GET(req) {
  const searchParams = new URLSearchParams(req.url);
  const accessCode = searchParams.get("code");

  const { hostname } = getServerHost();

  const redirect_uri = makeQueryStringUrl(hostname + "/api/auth/callback", {
    provider: "google",
  });

  const tokenRes = await fetch(
    makeQueryStringUrl("https://oauth2.googleapis.com/token", {
      code: accessCode,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      //   redirect_uri: `${process.env.AUTH_URL}/api/auth/callback?provider=google`,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
    {
      method: "POST",
    }
  );

  if (!tokenRes.ok) {
    const tokenText = await tokenRes.text();
    redirect(
      makeQueryStringUrl("/", {
        status: 403,
        success: false,
        message: "Authtication failed",
      })
    );
  }

  const data = await tokenRes.json();
  if (!data) {
    console.log("token data is not valid, auth failed");
    redirect(
      makeQueryStringUrl("/", {
        status: 403,
        success: false,
        message: "Authtication failed",
      })
    );
  }

  const { payload: userInfo } = jwt.decode(data["id_token"]);

  try {
    // const { Client } = pg;
    // const client = new Client(process.env.DATABASE_URL);
    // await client.connect();

    const DBorm = new D1Orm(getDB());
    const userModel = UserModel(DBorm);

    const user = await userModel.First({ where: { email: userInfo["email"] } });

    // const user = await client.query("SELECT * FROM users WHERE email = $1", [
    //   userInfo["email"],
    // ]);

    let userData = null;
    if (user) {
      userData = user;
    } else {
      userData = {
        id: v4(),
        email: userInfo["email"],
        name: userInfo["name"],
        picture: userInfo["picture"],
      };
      const newUser = await userModel.InsertOne(userData);

      if (!newUser.rowCount) {
        redirect(
          makeQueryStringUrl("/", {
            status: 500,
            success: false,
            message: "Failed to log in, try again later",
          })
        );
      }

      userData = newUser;
    }

    const expire = Date.now() + 1000 * 60 * 60 * 24 * 7;

    const jwtPayload = {
      id: userData.id,
      name: userInfo["name"],
      email: userInfo["email"],
      picture: userInfo["picture"],
      exp: expire,
    };

    const jwtToken = await jwt.sign(jwtPayload, process.env.AUTH_SECRET);

    cookies().set({
      name: "jwtToken",
      value: jwtToken,
      secure: true,
      httpOnly: true,
      expires: expire,
      path: "/",
    });

    const callback_url = cookies().get("callback_url");
    const url = new URL(req.url);

    return NextResponse.redirect(
      callback_url ? callback_url.value : url.origin
    );
  } catch (error) {
    console.log("Login failed", error);

    redirect(
      makeQueryStringUrl("/", {
        status: 500,
        success: false,
        message: "Failed to log in, try again later",
      })
    );
  }

  redirect(
    makeQueryStringUrl("/", {
      status: 200,
      success: true,
      message: "Successfully logged in",
    })
  );
}

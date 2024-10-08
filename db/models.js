import { DataTypes, Model } from "d1-orm";

export const HelpModel = (orm) => {
  return new Model(
    {
      D1Orm: orm,
      tableName: "helpdata",
      primaryKeys: "id",
      // autoIncrement: "id",
      // uniqueKeys: [["email"]],
    },
    {
      id: DataTypes.STRING,
      name: DataTypes.STRING,
      details: DataTypes.STRING,
      phone: DataTypes.STRING,
      lat: DataTypes.INT,
      lon: DataTypes.INT,
      views: DataTypes.INT,
      isTest: DataTypes.INT,

      victim_email: DataTypes.STRING,
      victim_ip: DataTypes.STRING,
      added_at: DataTypes.INT,
    }
  );
};
export const UserModel = (orm) => {
  return new Model(
    {
      D1Orm: orm,
      tableName: "users",
      primaryKeys: "id",
      // autoIncrement: "id",
      // uniqueKeys: [["email"]],
    },
    {
      id: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      picture: DataTypes.STRING,
      added_at: DataTypes.INT,
    }
  );
};

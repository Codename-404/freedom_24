import { DataTypes, Model } from "d1-orm";

export const TestModel = (orm) => {
  return new Model(
    {
      D1Orm: orm,
      tableName: "testdata",
      primaryKeys: "id",
      // autoIncrement: "id",
      // uniqueKeys: [["email"]],
    },
    {
      id: DataTypes.INT,

      value: DataTypes.INT,

      added_at: DataTypes.INT,
    }
  );
};

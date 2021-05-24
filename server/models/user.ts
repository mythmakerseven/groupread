import {
  DataTypes,
  Model,
  BelongsToManyGetAssociationsMixin,
  Optional,
  BelongsToManySetAssociationsMixin,
  Association,
  HasManySetAssociationsMixin
  } from 'sequelize'
import getPool from '../utils/db'
import Group from './group'
import Post from './post'

const db = getPool()

interface UserAttributes {
  id: string,
  username: string,
  displayName: string,
  passwordHash: string,
  email: string,
  nameColor: string
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string
  public username!: string
  public displayName!: string
  public passwordHash!: string
  public email!: string
  public nameColor!: string
  
  public createdAt!: Date
  public updatedAt!: Date

  public getGroups!: BelongsToManyGetAssociationsMixin<Group>
  public addGroup!: BelongsToManySetAssociationsMixin<Group, string>
  // public makeAdmin!: HasManySetAssociationsMixin<Group, string>

  public readonly groups?: Group[]
  public readonly posts?: Post[]

  public static associations: {
    groups: Association<Group>,
    posts: Association<User, Post>,
    // admin: Association<User>
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    displayName: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    nameColor: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: '000000'
    }
  },
  {
    tableName: "Users",
    sequelize: db,
  }
)

User.belongsToMany(Group, { through: 'UserGroups' })
Group.belongsToMany(User, { through: 'UserGroups' })

// User.hasMany(Group, {
//   foreignKey: 'AdminId',
//   sourceKey: 'id',
//   as: 'admin'
// })

// Group.belongsTo(User, {
//   foreignKey: 'id'
// })

export default User
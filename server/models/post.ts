import { DataTypes } from 'sequelize'
import { BelongsToManyAddAssociationsMixin, HasOneSetAssociationMixin, HasOneGetAssociationMixin, Model, Optional } from "sequelize"
import getPool from '../utils/db'
import Group from './group'
import User from './user'

const db = getPool()

interface PostAttributes {
  id: string,
  parent: string,
  title: string,
  text: string,
  createdAt: Date,
  updatedAt: Date,
  GroupId: string,
  UserId: string
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'title' | 'parent'> {}

class Post extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {
  public id!: string
  public parent!: string
  public title!: string
  public text!: string
  public GroupId!: string
  public UserId!: string
  
  public createdAt!: Date
  public updatedAt!: Date

  public addPost!: BelongsToManyAddAssociationsMixin<Group, User>
  public setAuthor!: HasOneSetAssociationMixin<User, Post>
  public getAuthor!: HasOneGetAssociationMixin<User>

  // public static associations: {
  //   members: Association<Group, User>,
  //   posts: Association<Group, Post>
  // }

  }

Post.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    parent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    GroupId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "Posts",
    sequelize: db
  }
)

Post.belongsTo(Group)
Group.hasMany(Post)

Post.belongsTo(User)
User.hasMany(Post)

export default Post
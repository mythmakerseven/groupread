import {
  Association,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Optional,
  BelongsToManyGetAssociationsMixin
} from 'sequelize'
import User from './user'
import Post from './post'
import getPool from '../utils/db'

const db = getPool()

// NOTICE: The group model has an association with the user table. Unfortunately, choosing Sequelize was a huge mistake
// and I wasted hours trying to get the admin field to work with it. Now it's just done manually, by inserting the user's id
// at group creation time. This is the same result in the DB that Sequelize would do if it worked right.

// If you, dear reader, want to refactor to make the group-admin relation properly use the Sequelize API, I must warn you
// that the docs are near-useless. They seem to rewrite their entire syntax with every update without bothering to update
// old docs pages. Sequelize's support for TypeScript is pretty bad, requiring huge amounts of boilerplate without actually
// taking much advantage of TypeScript's functionality. Someday, maybe Groupread will switch to a better ORM, but for now
// I don't expect many changes to the models so I don't want to spend yet more time fighting with database stuff.

interface GroupAttributes {
  id: string,
  bookTitle: string,
  bookAuthor: string,
  bookYear: number,
  bookIsbn: string,
  bookOLID: string,
  bookPageCount: number,
  AdminId: string
}

type GroupCreationAttributes = Optional<GroupAttributes, 'id' | 'bookAuthor' | 'bookYear' | 'bookIsbn' | 'bookOLID'>

class Group extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes {
  public id!: string
  public bookTitle!: string
  public bookAuthor!: string
  public bookYear!: number
  public bookIsbn!: string
  public bookOLID!: string
  public bookPageCount!: number
  public AdminId!: string

  public createdAt!: Date
  public updatedAt!: Date

  public getUsers!: BelongsToManyGetAssociationsMixin<User>
  public getPosts!: HasManyGetAssociationsMixin<Post>

  public readonly members?: User[]
  public readonly posts?: Post[]

  public static associations: {
    members: Association<User, Group>
    posts: Association<Post, Group>
  }
}

Group.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    bookTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bookAuthor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bookYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bookIsbn: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    bookOLID: {
      type: DataTypes.STRING,
      allowNull: true // TODO: add handling for works that lack OLIDs
    },
    bookPageCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AdminId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Groups',
    sequelize: db
  }
)

export default Group
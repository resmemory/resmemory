import Users from './users.db';
import Bookmarks from './bookmarks.db';

const relationship = () => {
  Users.hasMany(Bookmarks, {
    sourceKey: 'userId',
    foreignKey: 'userId',
  });
  Bookmarks.belongsTo(Bookmarks, {
    targetKey: 'userId',
    foreignKey: 'userId',
  });
};

export default relationship;

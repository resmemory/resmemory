import Posts from './posts.db';
import Comments from './comments.db';

const relationship = () => {
  Posts.hasMany(Comments, {
    sourceKey: 'postId',
    foreignKey: 'postId',
  });
  Comments.belongsTo(Posts, {
    targetKey: 'postId',
    foreignKey: 'postId',
  });
};

export default relationship;

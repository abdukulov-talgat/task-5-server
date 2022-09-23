import { User } from './user';
import { Message } from './message';

// User.hasMany(Message, {
//     foreignKey: 'senderId',
// });
Message.belongsTo(User, {
    as: 'sender',
});

// User.hasMany(Message, {
//     foreignKey: 'receiverId',
// });
Message.belongsTo(User, {
    as: 'receiver',
});

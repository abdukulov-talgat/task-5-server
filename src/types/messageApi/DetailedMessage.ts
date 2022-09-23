import { Message } from '../../models/message';
import { User } from '../../models/user';

export interface DetailedMessage extends Message {
    sender: User;
    receiver: User;
}

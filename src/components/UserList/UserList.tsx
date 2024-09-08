import { Link } from 'react-router-dom'
import './UserList.css'
import { User } from '../../types/user'

const UserList = ({ userList }: { userList: User[] }) => {
  return (
    <div>
      {userList.map((item, index) => (
        <div className="user-item" key={index}>
          <div className="user-item-left">
            <div className="user-item-title">
              <Link className={'user-link'} to={`/${item.userId}`}>
                <span>{item.nickname}</span>
              </Link>
            </div>
            <div className="user-item-description">{item.email}</div>
          </div>
          <div className="user-item-right">
            <img
              src={
                item.profileImage ??
                'https://avatars.githubusercontent.com/u/42940044?v=4'
              }
              alt={`${item.nickname}_thumb`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserList

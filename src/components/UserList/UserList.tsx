import { Link } from 'react-router-dom'
import './UserList.css'
import { User } from '../../types/user'
import { Image } from 'react-bootstrap'

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
            <Image src={item.profileImage} roundedCircle />
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserList

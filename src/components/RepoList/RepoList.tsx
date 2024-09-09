import { Link } from 'react-router-dom'
import './RepoList.css'
import { Post } from '../../types/post'
import { Star } from 'react-bootstrap-icons'

const RepoList = ({ repoData }: { repoData: Post[] }) => {
  return (
    <div>
      {repoData.map((item, index) => (
        <div className="repo-item" key={index}>
          <div className="repo-item-left">
            <div className="repo-item-title">
              <Link
                className={'repo-link'}
                to={`/${item.userId}/${item.postId}`}>
                <span>
                  {item.nickname}/{item.title}
                </span>
              </Link>
            </div>
            <div className="repo-item-tags">
              {item.tags.map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </div>
            <div className="repo-item-date">
              {new Date(item.lastModifiedAt).toLocaleDateString()}
            </div>
            <div className="repo-item-description">
              <Star /> <span>{item.likes}</span>
            </div>
          </div>
          <div className="repo-item-right">
            <img
              src={
                item.profileImage ??
                'https://avatars.githubusercontent.com/u/42940044?v=4'
              }
              alt={`${item.title}_thumb`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default RepoList

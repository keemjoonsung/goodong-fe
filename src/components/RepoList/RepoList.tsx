import { Link } from 'react-router-dom'
import './RepoList.css'
import { Post } from '../../types/post'

const RepoList = ({ repoData }: { repoData: Post[] }) => {
  return (
    <div>
      {repoData.map((item, index) => (
        <div className="repo-item" key={index}>
          <div className="repo-item-left">
            <div className="repo-item-title">
              <Link
                className={'repo-link'}
                to={`/${item.userId}/repository/${item.postId}`}>
                <span>{item.title}</span>
              </Link>
            </div>
            <div className="repo-item-description">{item.nickname}</div>
            <div className="repo-item-tags">
              {item.tags.map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
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

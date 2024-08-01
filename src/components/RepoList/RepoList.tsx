import { Link } from 'react-router-dom'
import './RepoList.css'

const RepoList = ({ repoData }: { repoData: any[] }) => {
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
            <div className="repo-item-description">{item.content}</div>
            <div className="repo-item-tags">
              <span>Tag1</span>
              <span>Tag2</span>
              <span>Tag3</span>
            </div>
          </div>
          <div className="repo-item-right">
            <img
              src="https://avatars.githubusercontent.com/u/42940044?v=4"
              alt={`${item.title}_thumb`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default RepoList

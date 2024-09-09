import { useState } from 'react'
import './CommentList.css'
import { Button, Form, Image } from 'react-bootstrap'
import api from '../../apis'
import { useNavigate } from 'react-router-dom'
import { Comment } from '../../types/post'

const CommentList = ({
  postId,
  comments,
}: {
  postId: number
  comments: Comment[]
}) => {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  const submitComment = async () => {
    if (input.trim() === '') {
      return
    }
    try {
      await api.comment.addComment(postId, input).then(res => {
        console.log(res.data)
      })
      alert('Comment added')
      // refresh page
      navigate(0)
    } catch (e) {
      console.log(e)
      alert('Failed to add comment')
    }
  }

  return (
    <div className="comment-list">
      <h3>{comments.length} Comments</h3>
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Comment"
        value={input}
        onChange={handleInputChange}></Form.Control>
      <div className="comment-button">
        <Button onClick={submitComment} disabled={input.trim().length === ''}>
          Add
        </Button>
      </div>
      <div className="comments">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <div className="comment-header">
              <Image
                src={
                  comment.profileImage ??
                  'https://avatars.githubusercontent.com/u/42940044?v=4'
                }
              />
              <div className="comment-header-right">
                <div className="comment-header-nickname">
                  {comment.nickname}
                </div>
                <div className="comment-header-date">
                  {new Date(comment.lastModifiedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentList

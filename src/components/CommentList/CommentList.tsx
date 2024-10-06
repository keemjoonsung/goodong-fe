import { useState } from 'react'
import './CommentList.css'
import { Button, Form, Image } from 'react-bootstrap'
import api from '../../apis'
import { Link, useNavigate } from 'react-router-dom'
import { Comment } from '../../types/post'
import { Pencil, Trash } from 'react-bootstrap-icons'
import useMainStore from '../../stores'

const CommentList = ({
  postId,
  comments,
}: {
  postId: number
  comments: Comment[]
}) => {
  const [input, setInput] = useState('')
  const [editOpen, setEditOpen] = useState<number | null>(null)
  const [editInput, setEditInput] = useState('')
  const user = useMainStore(state => state.user)
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

  const editComment = async (commentId: number) => {
    if (editInput.trim() === '') {
      return
    }
    try {
      await api.comment.updateComment(commentId, editInput)
    } catch (e) {
      console.log(e)
      alert('Failed to update comment')
    }
    setEditOpen(null)
    setEditInput('')
    // refresh page
    navigate(0)
  }

  const deleteComment = async (commentId: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.comment.deleteComment(commentId)
        alert('Comment deleted')
        // refresh page
        navigate(0)
      } catch (e) {
        console.log(e)
        alert('Failed to delete comment')
      }
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
        <Button onClick={submitComment} disabled={input.trim() === ''}>
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
                  <Link to={`/${comment.userId}`}>{comment.nickname}</Link>
                </div>
                <div className="comment-header-date">
                  {new Date(comment.lastModifiedAt).toLocaleDateString()}
                </div>
              </div>
              {comment.userId === user?.userId && (
                <div className="comment-header-actions">
                  {editOpen === comment.commentId ? (
                    <Button
                      onClick={() => {
                        editComment(comment.commentId)
                      }}
                      disabled={
                        editInput.trim() === '' || editInput === comment.content
                      }>
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setEditOpen(comment.commentId)
                        setEditInput(comment.content)
                      }}>
                      <Pencil />
                    </Button>
                  )}
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      deleteComment(comment.commentId)
                    }}>
                    <Trash />
                  </Button>
                </div>
              )}
            </div>
            {editOpen === comment.commentId ? (
              <Form.Control
                as="textarea"
                rows={3}
                value={editInput}
                onChange={e => setEditInput(e.target.value)}></Form.Control>
            ) : (
              <div className="comment-content">{comment.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentList

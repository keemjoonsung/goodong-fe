import './ProfileEditPage.css'

import { Button, Form, Image } from 'react-bootstrap'
import api from '../../apis'
import { useNavigate, useParams } from 'react-router-dom'
import useMainStore from '../../stores'
import { useEffect, useMemo, useState } from 'react'

const ProfileEditPage = () => {
  const user = useMainStore(state => state.user)
  const { userID } = useParams()
  const navigate = useNavigate()
  const [curUserName, setCurUserName] = useState('')
  const [curUserImage, setCurUserImage] = useState('')
  const isChanged = useMemo(
    () => curUserName !== user?.nickname || curUserImage !== user?.profileImage,
    [curUserName, curUserImage, user],
  )

  const handleSubmit = async () => {
    if (!user) return
    const formData = new FormData()
    if (curUserImage !== user.profileImage) {
      const blob = await fetch(curUserImage).then(res => res.blob())
      formData.append('filePng', blob)
    }
    if (curUserName !== user.nickname) {
      formData.append('nickname', curUserName)
    }
    await api.user.updateUser(formData)
    navigate(`/${user.userId}`)
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      setCurUserImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (
      !user ||
      !userID ||
      isNaN(parseInt(userID)) ||
      user.userId !== parseInt(userID)
    ) {
      navigate(`/${userID}`)
      return
    }
    const fetchUser = async (id: number) => {
      const user = await api.user.getUser(id)
      setCurUserName(user.nickname)
      setCurUserImage(user.profileImage)
    }
    fetchUser(user.userId)
  }, [userID, user])

  return (
    <div className="edit-profile">
      <div className="edit-profile-form">
        <Form>
          <Form.Label>Profile Image</Form.Label>
          <Image src={curUserImage} roundedCircle />
          <Form.Control
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
        </Form>
        <Form>
          {/* edit username */}
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={curUserName}
              onChange={e => setCurUserName(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Button onClick={handleSubmit} disabled={!isChanged}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default ProfileEditPage

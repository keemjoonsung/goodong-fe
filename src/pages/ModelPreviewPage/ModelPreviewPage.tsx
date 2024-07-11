import React, {useEffect, useState, Suspense, useRef} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Canvas, useThree} from '@react-three/fiber'
import {useLoader} from '@react-three/fiber'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {Environment, OrbitControls} from '@react-three/drei'
import * as THREE from 'three'
import {CopyToClipboard} from 'react-copy-to-clipboard/src'
import './ModelPreviewPage.css'
import {GLTFLoader} from 'three/examples/jsm/Addons.js'
import api from '../../apis'

const Model = ({url}: {url: string}) => {
  const [yPos, setYPos] = useState(0)
  const [xPos, setXPos] = useState(0)
  const gltf = useLoader(GLTFLoader, url) as any
  const [scaleFactor, setScaleFactor] = useState(1)

  useEffect(() => {
    if (gltf) {
      const bbox = new THREE.Box3().setFromObject(gltf.scene)
      const min = bbox.min
      const max = bbox.max
      const miny = Math.floor(min.y)
      const maxy = Math.floor(max.y)

      console.log(bbox)
      console.log((miny + maxy) / 2)
      console.log(miny)
      console.log(maxy)
      setYPos((miny + maxy) / 2)
      setXPos((min.x + max.x) / 2)
      console.log((min.x + max.x) / 2)
      const size = new THREE.Vector3()
      bbox.getSize(size)
      const newScaleFactor = 4 / Math.max(size.x, size.y, size.z)
      setScaleFactor(newScaleFactor)
    }
  }, [gltf])

  return (
    <>
      <primitive
        position={[xPos, yPos, 0]}
        object={gltf.scene}
        scale={scaleFactor}
      />
    </>
  )
}

// const getModelCode = ({urlString}) => {
//     console.log("url string : " + urlString)
//     return urlString.match(/\/models\/([^\/]+)\//)[1];
// }

const ModelPreviewPage = () => {
  const [postData, setPostData] = useState<{
    title: string
    content: string
    fileUrl: string
  } | null>(null)
  const [modelCode, setModelCode] = useState('')
  const params = useParams()
  const postId = params['postID']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getPost(postId ?? '')
        console.log(response.data)
        setPostData(response.data)
        console.log('파일' + response.data.fileUrl)
        setModelCode(response.data.fileUrl.match(/\/models\/([^\/]+)\//)[1])
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [params]) // Only run useEffect when `params` changes
  return (
    <div id={'model-canvas'}>
      {postData ? (
        <>
          <div id={'title-container'}>
            <span id={'title'}>{postData.title} </span>
          </div>
          <hr />
          <div id={'code-container'}>
            <CopyToClipboard
              text={modelCode}
              onCopy={() => alert('Copy to Clipboard')}>
              <button className="btn-create" id={'btn-code'}>
                {' '}
                {'<'} {'>'} Code
              </button>
            </CopyToClipboard>
          </div>
          <div id={'canvas-container'}>
            <Canvas>
              <OrbitControls />
              <Environment preset="city" background blur={1} />
              <Suspense>
                <Model url={postData['fileUrl']} />
              </Suspense>
            </Canvas>
          </div>
          <div id={'content-container'}>
            <div id={'content-description'}>Description</div>
            <hr id={'readme'} />
            <div id={'content'}>{postData.content}</div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ModelPreviewPage

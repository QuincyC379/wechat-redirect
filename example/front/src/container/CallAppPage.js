import React, { useEffect } from 'react';
import CallApp from 'callapp-lib'
import styles from '../styles.module.css'


// 唤起app页面组件
const isWeixin = (function () {
  var ua = window.navigator.userAgent.toLowerCase()
  var matched = ua.match(/MicroMessenger/i)
  return (matched && matched[0]) === 'micromessenger'
})()
const appProtocol = 'taobao'
const appStoreLink = 'itms-apps://itunes.apple.com/app/id387682726?mt=8'
const androidDownloadLink = `https://h5.m.taobao.com/bcec/downloadTaobao.html?`
const defaultOptions = {
  scheme: {
    protocol: appProtocol
  },
  intent: {
    package: 'com.taobao.taobao',
    scheme: appProtocol
  },
  appstore: appStoreLink,
  yingyongbao: androidDownloadLink,
  fallback: androidDownloadLink,
  timeout: 2000
}

const invokeAppOpen = (
  path,
  option
) => {
  const callApp = new CallApp({ ...defaultOptions, ...option })
  callApp.open({
    path: path
  })
}

const CallAppWorkflow = () => (
  <div className={styles.workflow}>
    <h1><span role="img" aria-label="doom">🔥</span>唤起流程说明</h1>
    <p><small><span role="img" aria-label="ball">⚾️</span>非微信环境，有app直接打开，没有app跳转到app下载页面</small></p>
    <p><small><span role="img" aria-label="ball">🏀</span>微信环境，先跳出微信打开本地浏览器再进行唤起a操作</small></p>
  </div>
)
export default () => {
  useEffect(() => {
    if (isWeixin) {
      getRedirect()
    }
  }, [])
  const getRedirect = async () => {
    try {
      const serverData = await fetch(`/api/geturl?url=${window.location.href}`)
      const { data, msg, type } = await serverData.json()
      if (!type) return alert(msg)
      window.location.href = `/api/jump/${data}`
    } catch (error) {
      alert('服务器在发呆😐~')
    }
    return
  }
  const openApp = async () => {
    invokeAppOpen('taobao.com')
  }
  return (
    <div className={styles.callAppContainer}>
      {
        isWeixin
          ? <h4>正在跳出，请稍后。。。</h4>
          : <>
            <CallAppWorkflow />
            <span onClick={openApp} className={styles.openBtn}>打开淘宝APP</span>
          </>
      }
    </div>
  )
}
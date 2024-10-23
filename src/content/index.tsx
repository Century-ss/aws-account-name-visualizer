import { convertAccountTextListToRows } from '../popup/Popup'

const main = async () => {
  if (!location.href.includes('console.aws.amazon.com')) {
    return
  }

  try {
    await displayAccountName()
  } catch (error) {
    console.log('Retry because of error: ', error)
    await sleep(3000)
    await displayAccountName()
  }
}

const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec))

const displayAccountName = async () => {
  await sleep(3000)

  const buttonElement = document.getElementById('nav-usernameMenu')

  if (!buttonElement) {
    throw new Error('Not found user menu button.')
  }

  // ボタンをクリック
  buttonElement.click()

  const spanElements = document.querySelectorAll('span')

  // "アカウント ID: " を含む span 要素を探す
  const accountLabelElement = Array.from(spanElements).find((span) =>
    span.textContent?.includes('アカウント ID: '),
  )

  if (!accountLabelElement) {
    throw new Error('アカウント ID ラベルが見つかりませんでした。')
  }

  const accountIdElement = accountLabelElement.nextElementSibling
  if (!accountIdElement?.textContent) {
    throw new Error('Not found account ID element.')
  }

  const accountId = accountIdElement.textContent.replace(/-/g, '')

  // buttonElementの中のspan要素を取得
  const displayElement = Array.from(buttonElement.getElementsByTagName('span')).find(
    (span) =>
      span.textContent?.includes('AWSAdministratorAccess/') ||
      span.textContent?.includes('AWSPowerUserAccess/') ||
      span.textContent?.includes('ReadOnlyAccess/'),
  )

  if (!displayElement) {
    throw new Error('displayElementが見つかりませんでした。')
  }

  chrome.storage.sync.get('accountTextList', (result) => {
    const accountPairRows = convertAccountTextListToRows(result.accountTextList)
    const accountName = accountPairRows.find((row) => row.accountId === accountId)?.accountName
    if (!accountName) {
      throw new Error('Not found from registered account names.')
    }
    displayElement.textContent = accountName
  })

  buttonElement.click()
}

main()

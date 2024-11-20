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

  const menuButtonElement = document.getElementById('nav-usernameMenu')

  if (!menuButtonElement) {
    throw new Error('Not found user menu button.')
  }

  menuButtonElement.click()
  const spanElements = document.querySelectorAll('span')

  menuButtonElement.click()

  const accountLabelElement = Array.from(spanElements).find(
    (span) =>
      span.textContent?.includes('アカウント ID: ') || span.textContent?.includes('Account ID: '),
  )

  const accountIdElement: Element | null = accountLabelElement
    ? accountLabelElement.nextElementSibling
    : Array.from(spanElements).find((span) => {
        const accountIdRegex = /^\d{4}-\d{4}-\d{4}$/
        return accountIdRegex.test(span.textContent || '')
      }) || null

  if (!accountIdElement?.textContent) {
    throw new Error('Not found account ID element.')
  }

  const accountId = accountIdElement.textContent.replace(/-/g, '')

  const roleAndUserNameElement = Array.from(menuButtonElement.getElementsByTagName('span')).find(
    (span) =>
      span.textContent?.includes('AWSAdministratorAccess/') ||
      span.textContent?.includes('AWSPowerUserAccess/') ||
      span.textContent?.includes('ReadOnlyAccess/'),
  )

  if (!roleAndUserNameElement) {
    throw new Error('Not found role and user name element.')
  }

  chrome.storage.sync.get('accountTextList', (result) => {
    const accountPairRows = convertAccountTextListToRows(result.accountTextList)
    const accountName = accountPairRows.find((row) => row.accountId === accountId)?.accountName
    if (!accountName) {
      throw new Error('Not found from registered account names.')
    }
    const DisplayAccountElement = document.createElement('span')
    DisplayAccountElement.textContent = accountName
    DisplayAccountElement.style.cssText =
      'color: white; font-weight: bold; display: flex; align-items: center; justify-content: center;'
    menuButtonElement.parentNode?.insertBefore(DisplayAccountElement, menuButtonElement)

    // For taking sample images for description
    // DisplayAccountElement.textContent = 'Account Name'
    // DisplayAccountElement.style.cssText =
    //   'color: white; font-weight: bold; display: flex; align-items: center; justify-content: center;'
    // menuButtonElement.parentNode?.insertBefore(DisplayAccountElement, menuButtonElement)
    // roleAndUserNameElement.textContent = 'AWSAdministratorAccess/user-name'
  })

  menuButtonElement.click()
}

main()

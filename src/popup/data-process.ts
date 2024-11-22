import type { Row } from './Popup'

export const convertAccountTextListToRows = (accountTextList: string[] | undefined) => {
  if (!accountTextList || accountTextList.length === 0) {
    throw new Error('No account registered')
  }

  const accountPairs = accountTextList.map((accountText, index) => {
    // accountTextList: ['[accountName]\naccountId', ...]
    const [accountName, accountId] = accountText.split('\n')
    return {
      id: index,
      accountId: accountId.trim(),
      accountName: accountName.replace(/[\[\]]/g, '').trim(),
    }
  })
  return accountPairs
}

export const convertRowsToAccountTextField = (rows: Row[]) => {
  const accountTextList = rows.map((row) => `[${row.accountName}]\n${row.accountId}`)
  return accountTextList.join('\n\n')
}

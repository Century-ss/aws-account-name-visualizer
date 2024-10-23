import { describe, it, expect } from 'vitest'
import { convertRowsToAccountTextField, convertAccountTextListToRows } from './Popup'

describe('parse account text list', () => {
  it('should return an empty array when input is empty', () => {
    const accountTextList: string[] = []
    const result = convertAccountTextListToRows(accountTextList)
    expect(result).toEqual([])
  })

  it('should return an array of rows when input is not empty', () => {
    const accountTextList = ['[accountName1]\naccountId1', '[accountName2]\naccountId2']
    const result = convertAccountTextListToRows(accountTextList)
    expect(result).toEqual([
      { id: 0, accountName: 'accountName1', accountId: 'accountId1' },
      { id: 1, accountName: 'accountName2', accountId: 'accountId2' },
    ])
  })
})

describe('format rows to account text', () => {
  it('should convert rows to account text filed format', () => {
    const rows = [
      { id: 0, accountName: 'accountName1', accountId: 'accountId1' },
      { id: 1, accountName: 'accountName2', accountId: 'accountId2' },
    ]
    const result = convertRowsToAccountTextField(rows)
    expect(result).toEqual('[accountName1]\naccountId1\n\n[accountName2]\naccountId2')
  })
})

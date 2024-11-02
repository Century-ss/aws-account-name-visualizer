import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

type Row = {
  id: number
  accountId: string
  accountName: string
}

type Column = {
  field: keyof Row
  headerName: string
}

const columns: Column[] = [
  { field: 'accountName', headerName: 'Account Name' },
  { field: 'accountId', headerName: 'Account ID' },
]

const CustomNoRowsOverlay = () => (
  <Box sx={{ p: 2, textAlign: 'center' }}>No account registered</Box>
)

export const convertAccountTextListToRows = (accountTextList: string[]) => {
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

const ELEMENT_WIDTH = 400
const ELEMENT_HEIGHT = 400

export const Popup = () => {
  useEffect(() => {
    document.body.style.width = `${ELEMENT_WIDTH}px`
    document.body.style.height = `${ELEMENT_HEIGHT}px`
  }, [])

  const registerAccountText = useRef<HTMLTextAreaElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    chrome.storage.sync.get('accountTextList', (result) => {
      const accountPairRows = convertAccountTextListToRows(result.accountTextList)
      setRows(accountPairRows)
    })
  }, [])

  const handleSave = () => {
    if (!registerAccountText.current) return

    setIsSaving(true)

    const accountTextList = registerAccountText.current.value.split('\n\n')
    chrome.storage.sync.clear(() => {
      chrome.storage.sync.set({ accountTextList }, () => {
        setTimeout(() => {
          setIsSaving(false)
          const saveStatusElement = document.getElementById('saveStatus')
          if (saveStatusElement) {
            saveStatusElement.textContent = 'Save Completed!'
            setTimeout(() => {
              saveStatusElement.textContent = ''
            }, 2000)
          }
        }, 2000)

        const accountPairRows = convertAccountTextListToRows(accountTextList)
        setRows(accountPairRows)
      })
    })
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h3>Register AWS Account ID</h3>

        <TextField
          id="message"
          multiline
          rows={8}
          variant="outlined"
          inputRef={registerAccountText}
          defaultValue={convertRowsToAccountTextField(rows)}
          sx={{
            '& .MuiInputBase-input': {
              resize: 'both', // マウスで大きさを変えられるようにする
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, ml: 12 }}>
        <Button
          id="saveButton"
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          sx={{ textTransform: 'none' }}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
        {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
        <Typography id="saveStatus" sx={{ mt: 1, ml: 2 }}></Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 260,
          mt: 1,
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>{String(row[column.field])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}

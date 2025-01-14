import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useEffect, useRef, useState } from 'react'

import { convertAccountTextListToRows, convertRowsToAccountTextField } from './data-process'

export type Row = {
  id: number
  accountId: string
  accountName: string
}

const columns: GridColDef[] = [
  { field: 'accountName', headerName: 'Account Name', flex: 1 },
  { field: 'accountId', headerName: 'Account ID', flex: 1 },
]

const NoRowsOverlay = () => <Box sx={{ p: 2, textAlign: 'center' }}>No account registered</Box>

export const Popup = () => {
  useEffect(() => {
    document.body.style.width = '300px'
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
            }, 1000)
          }
        }, 1000)

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
          multiline
          rows={8}
          variant="outlined"
          inputRef={registerAccountText}
          // TODO: Validate the input value
          defaultValue={convertRowsToAccountTextField(rows)}
          placeholder="[account-name-1]&#10;account-id-1&#10;&#10;[account-name-2]&#10;account-id-2&#10;&#10;..."
          sx={{
            '& .MuiInputBase-input': {
              resize: 'both',
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, ml: 6 }}>
        <Button
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

      <Box sx={{ height: 250, mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          slots={{
            noRowsOverlay: NoRowsOverlay,
          }}
        />
      </Box>
    </>
  )
}

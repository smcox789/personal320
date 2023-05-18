import React, { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMutation } from "react-query"
import { API } from "@/lib/api"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

function Modal(props: {
  sectionNumber: any
  currentCap: any
  profEmail: string
  isOpen: boolean
  onClose: () => void
}) {
  const [inputs, setInputs] = useState({ capChange: 0 })
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const changeCap = useMutation({
    mutationFn: API.changeCap,
    onSuccess: async () => {},
    onError: (error: any) => {
      console.log(error.response.data.message)
    },
  })

  if (!props.isOpen) {
    return null
  }

  function handleCloseModal(submit: boolean) {
    if (submit) {
      changeCap.mutate({
        profEmail: props.profEmail,
        capChange: inputs.capChange,
      })
    }
    props.onClose()
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Modify Cap of Section {props.sectionNumber}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div
          className={
            "text-sm space-y-4 text-cyan-500 dark:text-cyan-400 w-full items-center gap-1.5 space-y-5 bg-cyan-900"
          }
        >
          <div>
            <Label htmlFor="current-value">Current Cap</Label>
            <Input
              id="number"
              disabled
              type="number"
              value={props.currentCap}
            />
          </div>
          <div>
            <Label htmlFor="capChange">New Cap</Label>
            <Input
              name="capChange"
              id="capChange"
              type="number"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleCloseModal(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleCloseModal(true)}>
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Modal

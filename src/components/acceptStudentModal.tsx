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
import { useMutation, useQueryClient } from "react-query"
import { API } from "@/lib/api"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  studentEmail: string
  profEmail: string
  accepted: boolean
  student: any
  application: any
}

function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    studentEmail,
    profEmail,
    accepted,
    student,
    application,
  } = props
  const [isModalOpen, setIsModalOpen] = useState(true)
  const queryClient = useQueryClient()
  const acceptDenyStudent = useMutation({
    // queryKey: ["login"],
    mutationFn: API.accept,
    onSuccess: async (data: any) => {
      // Invalidate and refetch
      console.log("Application submitted")

      queryClient.invalidateQueries({ queryKey: ["accept"] })
    },
    onError: (error: any) => {
      console.log(error.response.data.message)

      queryClient.invalidateQueries({ queryKey: ["accept"] })
    },
  })

  if (!isOpen) {
    return null
  }
  function openModal() {
    setIsModalOpen(true)
  }

  function handleCloseModal(submit: boolean) {
    if (submit) {
      console.log(accepted, studentEmail, profEmail)
      acceptDenyStudent.mutate({
        accept: accepted,
        studEmail: studentEmail,
        profEmail: profEmail,
      })
      window.location.reload()
    }
    onClose()
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {accepted ? (
            <AlertDialogTitle>Accept {student.name}?</AlertDialogTitle>
          ) : (
            <AlertDialogTitle>Deny {student.name}? </AlertDialogTitle>
          )}
        </AlertDialogHeader>

        <div
          className={
            "text-sm space-y-4 text-cyan-500 dark:text-cyan-400 w-full items-center gap-1.5 space-y-5 bg-cyan-900"
          }
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" disabled type="email" value={student.email} />
          </div>
          <div>
            <Label htmlFor="preferences">Preferences</Label>
            <Input
              id="preferences"
              disabled
              type="text"
              value={application.preferences.join(", ")}
            />
          </div>
          <div>
            <Label htmlFor="taken320">Taken 320?</Label>
            <Input
              id="taken320"
              disabled
              type="text"
              value={application.taken320 ? "Yes" : "No"}
            />
          </div>
          {application.taken320 && (
            <div>
              <Label htmlFor="grade320">Grade in 320</Label>
              <Input
                id="grade320"
                disabled
                type="text"
                value={application.grade320}
              />
            </div>
          )}
          <div>
            <Label htmlFor="taken320">References</Label>
            <Textarea id="taken320" disabled value={application.references} />
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

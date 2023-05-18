import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { MultiSelect, Option } from "react-multi-select-component"
import { ChangeEvent, isValidElement, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { API } from "@/lib/api"

export default function SubmissionForm(props: any) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const submitApp = useMutation({
    mutationFn: API.submitStudentApplication,
    onSuccess: async () => {
      console.log("Application submitted")
      window.location.reload()
      await queryClient.invalidateQueries({ queryKey: ["submit"] })
    },
    onError: (error: any) => {
      window.location.reload()
      console.log(error.response.data.message)
      queryClient.invalidateQueries({ queryKey: ["submit"] })
    },
  })

  const options = props.sectionList
    ? props.sectionList.data.map((e: any) => {
        return { label: e.sectionNumber, value: e.sectionNumber }
      })
    : []
  const [selected, setSelected] = useState<Option[]>([])
  const handleSelectedChanged = (selected: Option[]) => {
    setSelected(selected)
  }

  const profile = useQuery({
    queryKey: ["student-details"],
    queryFn: API.getProfile,
  })

  const [refBackText, setRefBackInputText] = useState("")
  const handleRefBackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // 👇 Store the input value to local state
    setRefBackInputText(e.target.value)
  }

  // Form validation
  const [invalidData, setInvalidData] = useState(true)

  const [grade, setGrade] = useState("A")
  const handleGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value)
  }

  const [taken320, setTaken320] = useState(false)
  const taken320Handler = () => {
    setTaken320(!taken320)
  }

  // For Form Validation
  useEffect(() => {
    // Form validation logic that depends on the `selected` state variable
    interface DataItem {
      label: string
      value: string
    }
    const prefs = selected.map((item: DataItem) => item.label)
    // Used to extract items from the dropdown
    if (prefs.length > 0 && grade === "A" && taken320) {
      setInvalidData(false)
    } else {
      setInvalidData(true)
    }
  }, [selected, taken320, grade]) // Trigger the effect whenever the `selected` state variable changes

  const submitApplication = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Used to extract items from the dropdown
    interface DataItem {
      label: string
      value: string
    }
    const prefs = selected.map((item: DataItem) => item.label)

    event.preventDefault()
    submitApp.mutate({
      email: profile.data.email,
      CS320taken: taken320,
      references: [refBackText],
      cs320grade: grade,
      preference: prefs,
    })
    window.location.reload()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Submit!</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submission Form</AlertDialogTitle>
          <div
            className={
              "columns-2 text-sm space-y-4 text-cyan-500 dark:text-cyan-400 w-full items-center gap-1.5 bg-cyan-900"
            }
          >
            <div>
              <Label htmlFor="Email">First Name</Label>
              <Input
                disabled={true}
                className="w-full"
                type="text"
                id="email"
                value={profile.data.username.split(" ")[0]}
              />
            </div>
            <div>
              <Label htmlFor="Email">Last Name</Label>
              <Input
                disabled={true}
                className="w-full"
                type="text"
                id="email"
                value={profile.data.username.split(" ")[1]}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-cyan-500 dark:text-cyan-400 grid w-full items-center gap-1.5 bg-cyan-900">
              <Label htmlFor="Email">Sections in Order of Preferred: </Label>
              <MultiSelect
                options={options}
                value={selected}
                onChange={handleSelectedChanged}
                labelledBy={"Select"}
                className="text-black"
              />
            </div>
            <div className="text-sm text-cyan-500 dark:text-cyan-400 grid w-full items-center gap-1.5">
              <Label htmlFor="Email">Email</Label>
              <Input
                className="w-full"
                type="text"
                id="email"
                value={profile.data.email}
                disabled={true}
              />
            </div>

            <div className="text-sm text-cyan-500 dark:text-cyan-400 items-start">
              <Label htmlFor="Have you taken 320?">Have you taken 320?</Label>
              <Input
                className="items-start"
                type="checkbox"
                id="taken-320"
                checked={taken320}
                onChange={taken320Handler}
              />
            </div>

            <div className="text-sm text-cyan-500 dark:text-cyan-400 grid w-full items-center gap-1.5">
              <Label htmlFor="Email">Previous Grade in 320: </Label>
              <select
                value={grade}
                onChange={handleGrade}
                className="flex h-10 w-full rounded-md border border-cyan-300 bg-transparent py-2 px-3 text-sm placeholder:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-cyan-700 dark:text-cyan-50 dark:focus:ring-cyan-400 dark:focus:ring-offset-cyan-900"
              >
                <option className="bg-cyan-900" value="A">
                  A
                </option>
                <option className="bg-cyan-900" value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="text-sm text-cyan-500 dark:text-cyan-400 grid w-full items-center gap-1.5">
              <Label htmlFor="Email">References & Background Information</Label>
              <textarea
                onChange={handleRefBackChange}
                value={refBackText}
                className="w-full h-fit max-h-32 flex h-10 w-full rounded-md border border-cyan-300 bg-transparent py-2 px-3 text-sm placeholder:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-cyan-700 dark:text-cyan-50 dark:focus:ring-cyan-400 dark:focus:ring-offset-cyan-900"
                id="background"
              />
            </div>
          </div>
        </AlertDialogHeader>
        <div
          className={"text-left items-start text-red-500"}
          style={{ visibility: !invalidData ? "hidden" : "visible" }}
        >
          Make sure you have selected sections, taken 320, and received an A.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={invalidData} onClick={submitApplication}>
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

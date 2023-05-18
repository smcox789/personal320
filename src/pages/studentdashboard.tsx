import Head from "next/head"
import { useQuery } from "react-query"
import Sections from "@/components/sections"
import Logout from "@/components/logout"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import NotSubmitted from "@/components/notsubmitted"
import { API } from "@/lib/api"
//Student Dashboard Page
export default function StudentDashboard(this: any) {
  //Obtain necessary information from /managerpool, /profile, and /allApplications endpoints.
  const classes = useQuery({
    queryKey: ["student-sections"],
    queryFn: API.getManagerPool,
  })
  const profile = useQuery({
    queryKey: ["student-details"],
    queryFn: API.getProfile,
  })
  const apps = useQuery({
    queryKey: ["student-applications"],
    queryFn: API.getAllStudentApplications,
  })

  //If the information from the endpoints are still being retreived, display loading text.
  if (profile.isLoading || classes.isLoading || apps.isLoading) {
    return <>Loading</>
  }

  //Get the index of the section which the student was accepted to
  const enrolledIndex = classes.data.reduce(
    //search all entries of classes.data
    (acc: any, e: any) =>
      //if the student is in the enrolled array of that entry of data, retun the index of the entry of data.
      e.enrolled.findIndex((x: any) => x._id === profile.data.id) !== -1
        ? classes.data.indexOf(e)
        : acc,
    //default value of -1
    -1
  )

  //get the current index of the entry in the student applications containing the application the current student
  const appIndex = apps.data.reduce(
    //if the email of the student is the same as the current entry of all applications, return the index
    (acc: any, e: any) =>
      e.email === profile.data.email ? apps.data.indexOf(e) : acc,
    //default value of -1
    -1
  )

  return (
    <>
      <Head>
        <title>Student Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mt-8 space-y-2">
        <div className="max-w-lg mx-auto space-y-2 text-black text-lg font-semibold">
          {
            //collapsible to display the name of the student, and the status of the student's application in a more general way
          }
          <Collapsible open={true}>
            <CollapsibleTrigger className="w-half block" data-state="open">
              <div className="flex items-center bg-cyan-400 px-6 py-4 justify-between text-black">
                {
                  //display name of user in the collapsible trigger
                  profile.data.username
                }
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent data-state="open">
              <div className="px-3 py-3 bg-white w-half">
                {
                  /*if the student is enrolled in a class, they were accepted, and display which section
                they were accepted to along with the name of the professor who accepted them. */
                  enrolledIndex !== -1 ? (
                    <li className="bg-green-100 px-3 py-2 rounded flex justify-between items-center">
                      <span className="flex justify-between items-center text-base font-normal">
                        Accepted into{" "}
                        {classes.data[enrolledIndex].sectionNumber} with{" "}
                        {classes.data[enrolledIndex].professor.name}
                      </span>
                    </li>
                  ) : /*If an application was submitted by the student was not accepted, 
                show which sections they have applied to, along with application information */
                  appIndex !== -1 ? (
                    <div className="bg-yellow-100 px-3 py-2 rounded text-base font-normal">
                      <div>
                        You have applied to sections{" "}
                        {apps.data[appIndex].preferences.join(", ")}
                      </div>
                      <div>320 Grade: {apps.data[appIndex].grade320}</div>
                      <div>References: {apps.data[appIndex].references}</div>
                    </div>
                  ) : (
                    //if both of these conditions fail, the student must not have submitted, display component which allows them to submit
                    <div className="text-base font-normal">
                      <NotSubmitted section={false} sectionList={classes} />
                    </div>
                  )
                }
              </div>
            </CollapsibleContent>
          </Collapsible>
          {
            //display other small graphical information on student dashboard.
          }
          <div className="mb-4 flex justify-between items-center text-white">
            <span className="text-lg font-semibold text-white">Sections</span>
            <Logout />
          </div>
        </div>

        <div className="max-w-lg mx-auto space-y-2">
          {
            //display sections
          }
          <Sections />
        </div>
      </main>
    </>
  )
}

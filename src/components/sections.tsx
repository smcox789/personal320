import StudentSection from "./sectionStudent"
import Accepted from "./accepted"
import Rejected from "./rejected"
import Pending from "./pending"
import NotSubmitted from "./notsubmitted"
import { useQuery } from "react-query"
import { API } from "@/lib/api"
import CapReached from "./capreached"

//Component responsible for displaying all sections
export default function Sections(this: any) {
  //Calls to API endpoints /managerpool, /profile, and /allApplications so that all necessary information can be displayed.
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

  //If data from API calls have not been loaded, display loading text.
  if (classes.isLoading || profile.isLoading || apps.isLoading) {
    return <>Loading</>
  }

  //If the classes.data endpoint is empty, potential issue with calling the API.
  if (classes.data.length === 0) {
    return <>Loading</>
  }

  //Finds the index of the student application using the email returned in the profile endpoint.
  const appIndex = apps.data.findIndex(
    (e: any) => e.email === profile.data.email
  )

  //Finds the classes for which the student is still being considered
  const consideredApplications = classes.data.reduce((acc: any, e: any) => {
    //If the index of the object containing the student's email in the applications array is non-empty, then the student is still being considered for that section, otherwise, they are not.
    const idx = e.applications.findIndex(
      (x: any) => x.email === profile.data.email
    )
    //push the current object representing the section for which the student is being considered to the array if they are in the section, otherwise do not
    idx !== -1 ? acc.push(e) : acc
    //return the accumulator passed to reduce
    return acc
  }, [])

  //Store preferences array for student if they have applied to any section, otherwise store -1.
  const preferences = appIndex !== -1 ? apps.data[appIndex].preferences : -1

  return (
    <>
      <div className="max-w-lg mx-auto space-y-2">
        {
          //dynamically render classes based on information returned by the endpoints
          classes.data.map((data: any) => (
            <StudentSection
              key={
                //passed key to remove error in developer tools
                data._id
              }
              section={
                //section number from current entry from current section returned by manager pool endpoint
                data.sectionNumber
              }
              professor={
                //professor from current entry returned by manager pool endpoint
                data.professor
              }
              enrolled={
                //remove duplicate students by filtering out any duplicate student which is not at the first occurence of the student in the enrolled array in current entry of data returned by managerpool endpoint.
                data.enrolled.filter(
                  (elem: any, index: number) =>
                    data.enrolled.findIndex(
                      (e: any) => e.email === elem.email
                    ) === index
                )
              }
              cap={
                //current cap in entry of data returned by manager pool endpoint.
                data.cap
              }
              schedule={data.schedule}
              status={
                //boolean logic to check if the student was accepted, rejected, the cap was reached, the application is pending, or you did not submit an application to that section.
                //if the index of the student in the enrolled array is not -1, then the student is enrolled and accepted to the course
                data.enrolled.findIndex(
                  (e: any) => e._id === profile.data.id
                ) !== -1 ? (
                  <Accepted />
                ) : //if the student submitted an application, when the student submitted an application they specified section to submit to, the current section number is in their preferences, and the student is not being considered for the course, they were rejected.
                appIndex !== -1 &&
                  preferences !== -1 &&
                  preferences.indexOf(data.sectionNumber) !== -1 &&
                  consideredApplications.findIndex(
                    (e: any) => e.sectionNumber === data.sectionNumber
                  ) === -1 ? (
                  <Rejected />
                ) : /*If the total cap for the course was reached, and the student is not enrolled in the course, 
                display that the cap was reached. */
                data.enrolled.filter(
                    (elem: any, index: number) =>
                      data.enrolled.findIndex(
                        (e: any) => e.email === elem.email
                      ) === index
                  ).length >= data.cap ? (
                  <CapReached />
                ) : /* If the student did not submit an application, or the student did not submit an 
                application to that particular section, then the student did not submit. */
                appIndex === -1 ||
                  apps.data[appIndex].preferences.indexOf(
                    data.sectionNumber
                  ) === -1 ? (
                  <NotSubmitted
                    section={
                      //pass true to indicate that this is for a section.
                      true
                    }
                  />
                ) : (
                  //otherwise, the student is pending
                  <Pending
                    applications={
                      //pass application information from allApplications endpoint
                      apps.data
                    }
                    email={
                      //pass email of student obtained from profile endpoint
                      profile.data.email
                    }
                    number={
                      //pass the section number of the current entry of the data returned by the manager pool endpoint
                      data.sectionNumber
                    }
                    preferences={
                      //pass the preferences of the student obtained from the appApplications endpoint.
                      preferences
                    }
                  />
                )
              }
            />
          ))
        }
      </div>
    </>
  )
}

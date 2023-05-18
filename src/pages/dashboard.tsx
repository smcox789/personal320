import Head from "next/head"
import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Check, XIcon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import Logout from "@/components/logout"
import { useState } from "react"
import Modal from "@/components/acceptStudentModal"
import ChangeCapModal from "@/components/changeCapModal"
import { API } from "@/lib/api"

export default function Dashboard() {
  const queryClient = useQueryClient()

  const allApplicationsQuery = useQuery({
    queryKey: ["student-apps-all-applications"],
    queryFn: API.getAllStudentApplications,
  })
  const managerPoolQuery = useQuery({
    queryKey: ["manager-pool"],
    queryFn: API.getManagerPool,
  })
  const getProfileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: API.getProfile,
  })
  const sectionDetailsQuery = useQuery({
    queryKey: ["sections"],
    queryFn: API.getSections,
  })

  // Accept Student Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  function handleCloseModal() {
    setIsModalOpen(false)
  }

  const [accepted, setAccepted] = useState(true)

  function denyButton() {
    setAccepted(false)
    setIsModalOpen(true)
  }

  function acceptButton() {
    setAccepted(true)
    setIsModalOpen(true)
  }

  // Change Cap Modal
  const [isChangeCapModalOpen, setIsChangeCapModalOpen] = useState(false)
  function openChangeCapModal() {
    setIsChangeCapModalOpen(true)
  }

  function closeChangeCapModal() {
    setIsChangeCapModalOpen(false)
  }

  async function handleCloseChangeCapModal() {
    await queryClient.invalidateQueries({
      queryKey: ["student-apps-all-applications"],
    })
    await queryClient.invalidateQueries({ queryKey: ["manager-pool"] })
    await queryClient.invalidateQueries({ queryKey: ["profile"] })
    await queryClient.invalidateQueries({ queryKey: ["sections"] })
    closeChangeCapModal()
    window.location.reload()
  }

  if (
    allApplicationsQuery.isLoading ||
    managerPoolQuery.isLoading ||
    getProfileQuery.isLoading ||
    sectionDetailsQuery.isLoading
  ) {
    return <>Loading</>
  }

  const mySections = managerPoolQuery.data.filter(
    (section: any) => section.professor.email == getProfileQuery.data.email
  )

  const otherSections = managerPoolQuery.data.filter(
    (section: any) => section.professor.email != getProfileQuery.data.email
  )

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mt-8">
        <div className="max-w-lg mx-auto space-y-2">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-cyan-800">
              {getProfileQuery.data.name}'s Sections
            </span>
            <div className="flex justify-between items-center space-x-2">
              <Logout />
            </div>
          </div>

          {mySections.map((data: any) => (
            <Collapsible key={data._id}>
              <CollapsibleTrigger className="w-full block">
                <div className="flex items-center bg-cyan-400 px-6 py-4 justify-between">
                  <div className="text-cyan-950 font-semibold">
                    Section {data.sectionNumber}
                  </div>
                  {"Enrolled: " + data.enrolled.length + "/"}
                  {data.cap}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-3 py-3 bg-white">
                  <Button variant={"destructive"} onClick={openChangeCapModal}>
                    Modify Cap
                  </Button>
                  <ChangeCapModal
                    sectionNumber={data.sectionNumber}
                    currentCap={data.cap}
                    isOpen={isChangeCapModalOpen}
                    profEmail={getProfileQuery.data.email}
                    onClose={handleCloseChangeCapModal}
                  />
                  <div>Schedule</div>
                  <div className={"bg-pink-400 rounded px-2 py-2"}>
                    {data.schedule.map((data: any) => (
                      <div>{data}</div>
                    ))}
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <h1 className={"pt-2"}>Applications</h1>
                      {data.applications.length === 0 ? (
                        <div className={"bg-green-400 px-3 py-2 rounded"}>
                          None Yet
                        </div>
                      ) : (
                        ""
                      )}
                      {data.applications.map((data: any) => (
                        <Collapsible>
                          <CollapsibleTrigger className={"w-full items-start"}>
                            <li className="bg-yellow-100 px-3 py-2 rounded flex justify-between items-center">
                              <span className="flex justify-between items-center">
                                <ExclamationCircleIcon className="h-4 w-4 mr-1 text-yellow-500" />
                                {data.student.name}
                              </span>
                              <span className="space-x-2">
                                <Button
                                  onClick={acceptButton}
                                  id={data.student._id + "+accept"}
                                  size="sm"
                                  variant="subtle"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={denyButton}
                                  id={data.student._id}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                                <Modal
                                  application={data}
                                  student={data.student}
                                  isOpen={isModalOpen}
                                  studentEmail={data.student.email}
                                  profEmail={getProfileQuery.data.email}
                                  accepted={accepted}
                                  onClose={handleCloseModal}
                                />
                              </span>
                            </li>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div
                              className={
                                "pl-8 pt-4 border-l border-r border-b pb-4 rounded-b"
                              }
                            >
                              <div>
                                Sections in order of preference:{" "}
                                {data.preferences.join(", ")}
                              </div>
                              <div>320 Grade: {data.grade320}</div>
                              <div>References: {data.references}</div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </ul>

                    <ul className="space-y-2">
                      <h1 className={"pt-2"}>Enrolled</h1>
                      {data.enrolled.length === 0 ? (
                        <div className={"bg-green-400 px-3 py-2 rounded"}>
                          None Yet
                        </div>
                      ) : (
                        ""
                      )}
                      {data.enrolled.map((data: any) =>
                        data.name == undefined ? (
                          ""
                        ) : (
                          <Collapsible>
                            <CollapsibleTrigger
                              className={"w-full items-start"}
                            >
                              <li className="bg-green-400 px-3 py-2 rounded flex justify-between items-center">
                                <span className="flex justify-between items-center">
                                  {data.name}
                                </span>
                              </li>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div
                                className={
                                  "pl-8 pt-4 border-l border-r border-b pb-4 rounded-b"
                                }
                              >
                                <div>{data.email}</div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          <div className="max-w-lg mx-auto space-y-2">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-cyan-800 pt-5">
                Other Sections
              </span>
            </div>
          </div>
          {otherSections.map((data: any) => (
            <Collapsible key={data._id}>
              <CollapsibleTrigger className="w-full block">
                <div className="flex items-center bg-cyan-400 px-6 py-4 justify-between">
                  <div className="text-cyan-950 font-semibold">
                    {data.professor.name + ", Section: "} {data.sectionNumber}
                  </div>
                  {"Enrolled: " + data.enrolled.length + "/"}
                  {data.cap}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-3 py-3 bg-white">
                  <div>
                    <ul className="space-y-2">
                      <div>Schedule</div>
                      <div className={"bg-pink-400 rounded px-2 py-2"}>
                        {data.schedule.map((data: any) => (
                          <div>{data}</div>
                        ))}
                      </div>

                      <h1>Applications</h1>

                      {data.applications.length === 0 ? (
                        <div className={"bg-green-400 px-3 py-2 rounded"}>
                          None Yet
                        </div>
                      ) : (
                        ""
                      )}

                      {data.applications.map((data: any) => {
                        // console.log(data.student.name, data.email);
                        // console.log(data, data.student);
                        return (
                          <Collapsible>
                            <CollapsibleTrigger
                              className={"w-full items-start"}
                            >
                              <li className="bg-yellow-100 px-3 py-3 rounded flex items-center">
                                <span className="flex justify-between items-center">
                                  <ExclamationCircleIcon className="h-4 w-4 mr-1 text-yellow-500 align-middle" />
                                  {data.student.name}
                                </span>
                              </li>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div
                                className={
                                  "pl-8 pt-4 border-l border-r border-b pb-4 rounded-b"
                                }
                              >
                                <div>
                                  Sections in order of preference:{" "}
                                  {data.preferences.join(", ")}
                                </div>
                                <div>320 Grade: {data.grade320}</div>
                                <div>References: {data.references}</div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      })}
                      <ul className="space-y-2">
                        <h1 className={"pt-2"}>Enrolled</h1>
                        {data.enrolled.length === 0 ? (
                          <div className={"bg-green-400 px-3 py-2 rounded"}>
                            None Yet
                          </div>
                        ) : (
                          ""
                        )}
                        {data.enrolled.map((data: any) =>
                          data.name == undefined ? (
                            ""
                          ) : (
                            <Collapsible>
                              <CollapsibleTrigger
                                className={"w-full bg-green-200 rounded"}
                              >
                                <li className="w-full bg-green-200  px-3 py-2 rounded flex justify-between items-center ">
                                  <span className="flex justify-between items-center h-10 w-full">
                                    {data.name}
                                  </span>
                                </li>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div
                                  className={
                                    "pl-8 pt-4 border-l border-r border-b pb-4 rounded-b"
                                  }
                                >
                                  <div>{data.email}</div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        )}
                      </ul>
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </main>
    </>
  )
}

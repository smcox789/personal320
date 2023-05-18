import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"

//Component for section information for an individual CS429 section.
export default function StudentSection(props: any) {
  /* Uses a collapsible from Radix UI to display section information in a clean way.
  In general, uses different shades of cyan to display the collapsible part itself
  while also positioning text in a clean way using tailwind classes. */
  return (
    <>
      <Collapsible>
        <CollapsibleTrigger className="w-full block">
          <div className="flex items-center bg-cyan-400 px-6 py-4 justify-between">
            <div className="text-cyan-950 font-semibold">
              Section{" "}
              {
                //displays section number passed in as prop
                props.section
              }
            </div>
            <div>
              <div className="text-cyan-950 font-semibold">
                Enrolled:{" "}
                {
                  //displays the amount enrolled compared to the total amount which can enroll
                  `${props.enrolled.length} / ${props.cap}`
                }
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-3 bg-white">
            <div>
              <ul className="space-y-2">
                <div className="bg-pink-400 rounded px-2 py-2">
                  <div>Schedule:</div>
                  <div>
                    {
                      //displays time of the course passed in as a prop
                      props.schedule.map((e: any) => (
                        <div>{e}</div>
                      ))
                    }
                  </div>
                </div>
                <li className="bg-cyan-100 px-3 py-2 rounded flex justify-between items-center">
                  <span>
                    Professor:{" "}
                    {
                      //displays the name of the professor passed in as a prop
                      props.professor.name
                    }
                  </span>
                  <span className="space-x-2"></span>
                </li>
                {
                  //displays a status component (accepted/pending/notsubmitted/rejected) passed in as a prop
                  props.status
                }
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

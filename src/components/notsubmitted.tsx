import SubmissionForm from "./submissionform"

/*displays a component which either allows you to submit a form or not depending on 
if you're supposed to submit, or if the application status is supposed to be displayed
*/
export default function NotSubmitted(props: any) {
  /*Using classes from tailwind to display a purple background, round corners,
    display in the flex style, and move text to the left and right, with the span
    tag to display not submitted text, and a button depending on where the component is used. */
  return (
    <div>
      {props.section ? (
        <>
          <li className="bg-purple-100 px-3 py-2 rounded flex justify-between items-center">
            <span className="flex justify-between items-center">
              You have not submitted an application for this section.
            </span>
          </li>
        </>
      ) : (
        <>
          <li className="bg-purple-100 px-3 py-2 rounded flex justify-between items-center">
            <div>You have not submitted an application, submit here!</div>
            <div>
              <SubmissionForm sectionList={props.sectionList} />
            </div>
          </li>
        </>
      )}
    </div>
  )
}

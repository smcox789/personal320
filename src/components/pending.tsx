//Component to display the pending status of an application
export default function Pending(props: any) {
  /* Uses tailwind classes to display a yellow background, position text, and round the corners
  Takes in the preference list of the course section as a prop, and finds its index
  in the preference array to determine priority (smaller index = higher priority).*/
  return (
    <li className="bg-yellow-100 px-3 py-2 rounded">
      <div>Status: Pending</div>
      <div>
        Your priority for this course is{" "}
        {props.preferences.findIndex((e: any) => e === props.number) + 1} out of{" "}
        {props.preferences.length}
      </div>
    </li>
  )
}

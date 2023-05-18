//Component which displays the rejected status of an application.
export default function Rejected() {
  /*Using classes from tailwind to display a red background, round corners,
    display in the flex style, and move text to the left and right, with the span
    tag to display rejected text. */
  return (
    <li className="bg-red-100 px-3 py-2 rounded flex justify-between items-center">
      <span className="flex justify-between items-center">
        You were not accepted into this section.
      </span>
    </li>
  )
}

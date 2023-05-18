//Component which contains an accept message when accepted into a course.
export default function Accepted() {
  return (
    /*Using classes from tailwind to display a green background, round corners,
    display in the flex style, and move text to the left and right, with the span
    tag to display accepted text. */
    <li className="bg-green-100 px-3 py-2 rounded flex justify-between items-center">
      <span className="flex justify-between items-center">
        Status: Accepted
      </span>
    </li>
  )
}

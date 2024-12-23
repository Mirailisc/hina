type Props = {
  status: string
}

const Status: React.FC<Props> = ({ status }: Props): JSX.Element => {
  switch (status) {
    case 'ongoing':
      return <span className="mr-2 rounded bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white ">On Going</span>
    case 'completed':
      return <span className="mr-2 rounded bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white ">Completed</span>
    default:
      return <span className="mr-2 rounded bg-secondary-500 px-2.5 py-0.5 text-xs font-medium text-white ">{status}</span>
  }
}

export default Status

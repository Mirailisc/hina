type Props = {
  status: string
}

const Status: React.FC<Props> = ({ status }: Props): JSX.Element => {
  switch (status) {
    case 'ongoing':
      return (
        <span className="mr-2 rounded bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-green-900">
          {status}
        </span>
      )
    case 'completed':
      return (
        <span className="mr-2 rounded bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-red-900">
          {status}
        </span>
      )
    default:
      return <span>{status}</span>
  }
}

export default Status

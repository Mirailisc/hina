type Props = {
  setOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
  order: 'asc' | 'desc'
}

const OrderButton: React.FC<Props> = ({ order, setOrder }: Props): JSX.Element => {
  return (
    <div className="mt-4 flex flex-row justify-between">
      <h1 className="text-2xl font-bold">Chapters</h1>
      {order === 'asc' ? (
        <button
          onClick={() => setOrder('desc')}
          className="rounded-lg bg-white/20 px-3 py-1 text-sm text-white transition-opacity duration-200 hover:opacity-50"
        >
          Ascending
        </button>
      ) : (
        <button
          onClick={() => setOrder('asc')}
          className="rounded-lg bg-white/20 px-3 py-1 text-sm text-white transition-opacity duration-200 hover:opacity-50"
        >
          Descending
        </button>
      )}
    </div>
  )
}

export default OrderButton

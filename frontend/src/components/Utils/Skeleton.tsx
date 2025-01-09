type Props = {
  amount: number
}

const Skeleton: React.FC<Props> = ({ amount }: Props): JSX.Element => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: amount }).map((_, index) => (
        <div
          key={index}
          className="aspect-[11/16] w-full animate-pulse select-none rounded-lg bg-white/30"
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  )
}

export default Skeleton

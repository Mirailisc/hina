type Props = {
  amount: number
}

const Skeleton: React.FC<Props> = ({ amount }: Props): JSX.Element => {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
      {Array.from({ length: amount }).map((_, index) => (
        <div
          key={index}
          className="h-[270px] w-[170px] animate-pulse rounded-md rounded-t-lg bg-white/30 sm:w-[200px]"
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      ))}
    </div>
  )
}

export default Skeleton

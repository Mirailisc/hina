const Footer: React.FC = (): JSX.Element => {
  return (
    <div className="mt-10 border-t border-white/20">
      {/* <div className="py-10 pl-10 text-4xl">MangaDiddy</div> */}
      <div className="py-10 text-center text-white/50 md:pr-20 md:text-right">
        © 2024{' '}
        <a
          href="https://github.com/Mirailisc"
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-200 hover:text-primary-500"
        >
          Mirailisc
        </a>
      </div>
    </div>
  )
}

export default Footer

import Link from "next/link";

export default function Filing(): JSX.Element {

  return (
    <Link className="Filing_info hidden lg:block fixed right-6 bottom-3 p-1 rounded-sm text-sm text-accent-color-70" href="https://beian.miit.gov.cn">
      蜀ICP备2023022111号
    </Link>
  )
}

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { IconFolderOff } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

export const metadata = {
  title: "Upss... Halaman Tidak Ditemukan!"
}

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <IconFolderOff className="size-12" />
          </EmptyMedia>
          <EmptyTitle>Upss... Halaman Tidak Ditemukan!</EmptyTitle>
          <EmptyDescription>
            Halaman yang Anda cari tidak ada atau telah dipindahkan.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button variant="link" size="sm" asChild>
            <a href="/">
              Kembali Ke Beranda
              <ArrowUpRightIcon className="size-4" />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
"use client";

import { useDialogContent } from "@/components/content/dialog-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function PageLoginView() {
  const dialogContent = useDialogContent()

  return (
    <div className="w-full h-dvh flex">
      <div className="w-[50%] max-md:hidden flex items-center justify-center">
        <div className="absolute mr-48">
          <Image
            src="/icon/icon-1.svg"
            alt="Login"
            width={80}
            height={80}
            className="animate-bounce delay-75 -rotate-5"
          />
        </div>
        <div className="w-auto z-10">
          <Image
            src="/icon/icon.svg"
            alt="Login"
            width={120}
            height={120}
            className="animate-bounce"
          />
        </div>
        <div className="absolute ml-48">
          <Image
            src="/icon/icon-2.svg"
            alt="Login"
            width={90}
            height={90}
            className="animate-bounce rotate-5 delay-200"
          />
        </div>
      </div>
      <div className="w-[50%] px-6 max-md:w-full flex justify-center items-center">
        <form className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Masuk</h1>
          <p className="text-muted-foreground mt-1.5">Sebelum masuk ke Prakerin, silahkan login terlebih dahulu menggunakan akun yang sudah diberikan.</p>
          <label className="mt-7 w-full block">
            <span className="w-full block text-sm text-neutral-500 mb-1">Username / Email</span>
            <Input
              type="text"
              placeholder="admin / admin@gmail.com"
              name="username"
            />
          </label>
          <label className="mt-2.5 w-full block">
            <span className="w-full block text-sm text-neutral-500 mb-1">Kata Sandi</span>
            <Input
              type="password"
              placeholder="KataSandi#123"
              name="password"
            />
          </label>
          <Button className="mt-4 w-full cursor-pointer" type="submit">Masuk</Button>
          <div className="mt-5 w-full text-center text-sm text-neutral-400">
            <a className="cursor-pointer hover:underline" onClick={() => dialogContent.show({
              title: "Lupa kata sandi?",
              text: <>
                <p>Jika kamu adalah Guru/Siswa, hubungi admin/pihak admin sekolah untuk reset kata sandi kamu dari awal, jika kamu adalah admin, maka buka area project kemudian jalankan perintah.</p>
                <pre className="my-2 bg-neutral-100 px-2 py-0.5 rounded text-sm">
                  <code>
                    <span className="text-yellow-600">bun </span>
                    <span className="text-neutral-700">./reset-pw</span>
                  </code>
                </pre>
                <p>Cek <a className="cursor-pointer hover:underline text-blue-600" href="https://github.com/tkjskanesga/prakerin-hub?tab=readme-ov-file#reset-password" target="_blank">intruksi dokumentasi</a> untuk lebih lanjut.</p>
              </>,
              button: [{ text: "Baik!" }]
            })}>Lupa kata sandi?</a>
            <> • </>
            <a className="cursor-pointer hover:underline" onClick={() => dialogContent.show({
              title: "Tidak memiliki akun?",
              text: "Jika kamu adalah Guru/Siswa, silahkan hubungi admin/pihak admin sekolah untuk mendapatkan akun, pastikan juga sekolah terdaftar dalam sisten ini.",
              button: [{ text: "Baik!" }]
            })}>Tidak memiliki akun?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
import { FaFilePdf } from "react-icons/fa";
import { FaRegFileWord } from "react-icons/fa";
import { FaRegFileExcel } from "react-icons/fa";
import { CiText } from "react-icons/ci";
import { FaRegFileZipper } from "react-icons/fa6";

import React from 'react'

export default function FileTypeIcons({file}:{file:File}) {
    const fileExtension = file.name.split('.').pop()?.toLocaleLowerCase()
  return (
    <>
      {fileExtension === 'pdf' ? (
        <FaFilePdf />
      ) : fileExtension === 'docx' ? (
        <FaRegFileWord />
      ) : fileExtension === 'xlsx' ? (
        <FaRegFileExcel/>
      )  : fileExtension === 'txt' ? (
        <CiText />
      ) : fileExtension === 'zip' ? (
        <FaRegFileZipper />
      ) : (
        <FaFilePdf />
      )}
    </>
  )
}

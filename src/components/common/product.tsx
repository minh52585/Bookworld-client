import React from 'react'

type Books={
    title:string,
    author:string,
    price:number|string,
    image:string
}
const SelectedBook:Books={
    title: 'Doraemon Movie 44: Nobita và Vũ Trụ Phiêu Lưu Ký',
  author: 'Fujiko F. Fujio',
  price: 54.000,
  image: 'https://byvn.net/iHJr'
}
const mustReadBooks:Books[]=[
      {
        title: 'Doraemon Movie 44',
        author: 'Fujiko F Fujio',
        price: '54.000',
        image: 'https://byvn.net/iHJr',
    },
]


export default function product() {
  return (
    <div>product</div>
  )
}

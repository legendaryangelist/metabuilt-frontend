import { type NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import { memo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ICommunityInfo } from "../../data/interfaces";
import star1Img from "../../images/star1.svg";

const mockData: ICommunityInfo[] = [
    {
        community_id: 1,
        community_owner: "vself.near",
        community_name: "vSelf DAO",
        community_description: "Web3 identity wallet with for data",
        community_source_image: star1Img,
        members: [],
        public_members: []
    },
    {
        community_id: 2,
        community_owner: "vself.near",
        community_name: "vSelf DAO",
        community_description: "Web3 identity wallet with for data",
        community_source_image: star1Img,
        members: [],
        public_members: []
    },
    {
        community_id: 3,
        community_owner: "vself.near",
        community_name: "vSelf DAO",
        community_description: "Web3 identity wallet with for data",
        community_source_image: star1Img,
        members: [],
        public_members: []
    }
];

const Communities: NextPage = memo(() => {
    const router = useRouter();

    const handleNaviagte = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, path: string) => {
        e?.preventDefault();
        router.push(path);
    };

    return (
        <div className="text-white w-100 self-start">
            <h1 className="font-extrabold text-[40px] leading-[60px] tracking-wide my-[50px] font-grotesk tracking-[0.04em]">
                Find your community
            </h1>

            <div className="max-h-[300px] px-5 py-3 overflow-y-auto scrollbar-hide">
                <Row>
                    {
                        mockData.map((item, index) => {
                            return (
                                <Col key={index} sm={12} md={6} lg={4}>
                                    <div
                                        className="md:pt-[65px] md:pb-[30px] md:pl-[30px] md:pr-[50px] md:rounded-[20px] main-blue-bg relative mx-[50px] my-[20px] max-w-[520px] mx-auto cursor-pointer"
                                        onClick={(e) => handleNaviagte(e, `/communities/${item.community_id}`)}
                                    >
                                        <div className="absolute md:w-[100px] md:h-[100px] md:top-[-30px] md:right-[-30px]">
                                            <Image
                                                layout="responsive"
                                                src={item.community_source_image}
                                                alt="community_source_image"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <h1 className="text-[20px] leading-[40px] tracking-[0.04em] font-extrabold font-grotesk">{item.community_name}</h1>
                                            <div className="text-[16px] leading-[22px] font-normal font-inter">{item.community_description}</div>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>

            <div className="flex w-full justify-center items-center gap-[20px] mt-[100px]">
                <span className="text-[20px]">Type in the name</span>
                <div className="relative max-w-[500px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full py-2 pl-4 pr-12 text-white-500 border rounded-full outline-none bg-transparent focus:bg-white focus:border-indigo-600"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 right-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
});

export default Communities;
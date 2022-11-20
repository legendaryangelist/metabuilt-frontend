import { type NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import { memo, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ICommunityInfo } from "../../data/interfaces";
import { useContractInteractor } from "../../utils";
import Carousel from "react-multi-carousel";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const Communities: NextPage = memo(() => {
    const router = useRouter();
    const { viewMethod } = useContractInteractor();
    const [communities, setCommunities] = useState<ICommunityInfo[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [isMoving, setIsMoving] = useState<boolean>(false);

    const handleNaviagte = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, path: string) => {
        e?.preventDefault();
        if (!isMoving) {
            router.push(path);
        }
    };

    const initialize = async () => {
        try {
            const result: any[] = await viewMethod({
                method: "get_community_list",
                args: {
                    from_index: 0,
                    limit: 100
                }
            });

            const communities = await Promise.all(result.map(async (item, _) => {
                const rowData: ICommunityInfo = {
                    community_id: item[0],
                    community_owner: item[1]?.community_owner,
                    community_name: item[1]?.community_name,
                    community_description: item[1]?.community_description,
                    community_source_image: item[1]?.community_source_image,
                    badge_event_id: item[1]?.badge_event_id,
                    badge_name: item[1]?.badge_name,
                    badge_description: item[1]?.badge_description,
                    badge_source_image: item[1]?.badge_source_image
                };

                return rowData;
            }));

            setCommunities(communities);
        } catch (e) {
            console.log("error: ", e)
        }
    }

    useEffect(() => {
        (async () => {
            await initialize();
        })()
    }, []);

    return (
        <div className="text-white w-100 self-start">
            <h1 className="font-extrabold text-[40px] leading-[60px] tracking-wide my-[50px] font-grotesk tracking-[0.04em]">
                Find your community
            </h1>

            <div className="max-h-[300px] px-5 py-3">
                <Carousel
                    responsive={responsive}
                    ssr={true}
                    beforeChange={() => setIsMoving(true)}
                    afterChange={() => setIsMoving(false)}
                >
                    {
                        communities.filter(item => item.community_name.toLowerCase().includes(searchWord.toLowerCase())).map((item, index) => {
                            return (
                                <div
                                    className="pt-[65px] pb-[30px] pl-[30px] pr-[50px] rounded-[20px] main-blue-bg relative mx-[20px] my-[20px] cursor-pointer"
                                    onClick={(e) => handleNaviagte(e, `/communities/${item.community_id}`)}
                                >
                                    <div className="absolute md:w-[160px] md:h-[160px] md:top-[-30px] md:right-[-30px]">
                                        <Image
                                            layout="responsive"
                                            src={item.community_source_image}
                                            alt="community_source_image"
                                            width={120}
                                            height={120}
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h1 className="text-[20px] leading-[40px] tracking-[0.04em] font-extrabold font-grotesk">{item.community_name}</h1>
                                        <div className="text-[16px] leading-[22px] font-normal font-inter">{item.community_description}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Carousel>
            </div>

            <div className="flex w-full justify-center items-center gap-[20px] mt-[100px]">
                <span className="text-[20px]">Type in the name</span>
                <div className="relative max-w-[500px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full py-2 pl-4 pr-12 text-white-500 border rounded-full outline-none bg-transparent focus:bg-white focus:border-indigo-600"
                        onChange={(e) => setSearchWord(e?.target?.value)}
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
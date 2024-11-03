"use client";
import { imageLoader } from "@/hooks/image-loader";
import { ITeamDataType } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IteamPropsType {
  item: ITeamDataType;
  className?: string;
  teamWrapperClass?: string;
  isparentClass: boolean;
}

const TeamElementOne = ({
  item,
  className,
  teamWrapperClass,
  isparentClass,
}: IteamPropsType) => {
  return (
    <>
      {isparentClass === true ? (
        <>
          <div
            className={
              className
                ? className
                : "col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6"
            }
            data-wow-delay=".3s"
          >
            <div
              className={
                teamWrapperClass ? teamWrapperClass : "team-wrapper team-style"
              }
            >
              <div className="team-content-wrap position-relative">
                <div className="team-thumb">
                  <Link href={`/team-details/${item?.id}`}>
                    <Image src={item?.img} alt="image" />
                  </Link>
                </div>
                <div className="team-content">
                  <h6 className="team-member-name b3 underline">
                    <Link href={`/team-details/${item?.id}`}>
                      Ethan Mitchell
                    </Link>
                  </h6>
                  <span>Tour Guide</span>
                </div>
              </div>
              <div className="team-social">
                <Link
                  className="icon-01"
                  target="_blank"
                  href="https://www.facebook.com/"
                >
                  <i className="icon-facebook"></i>
                </Link>
                <Link
                  className="icon-02"
                  target="_blank"
                  href="https://www.instagram.com/"
                >
                  <i className="icon-instagram"></i>
                </Link>
                <Link
                  className="icon-03"
                  target="_blank"
                  href="https://twitter.com/"
                >
                  <i className="icon-twitter-x"></i>
                </Link>
                <Link
                  className="icon-04"
                  target="_blank"
                  href="https://www.linkedin.com/"
                >
                  <i className="icon-linkedin"></i>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={
              teamWrapperClass ? teamWrapperClass : "team-wrapper team-style"
            }
            data-wow-delay=".3s"
          >
            <div className="team-content-wrap position-relative">
              <div className="team-thumb">
                <Link href={`/team-details/${item?.id}`}>
                  <Image src={item?.img} alt="image" />
                </Link>
              </div>
              <div className="team-content">
                <h6 className="team-member-name b3 underline">
                  <Link href={`/team-details/${item?.id}`}>Ethan Mitchell</Link>
                </h6>
                <span>Tour Guide</span>
              </div>
            </div>
            <div className="team-social">
              <Link
                className="icon-01"
                target="_blank"
                href="https://www.facebook.com/"
              >
                <i className="icon-facebook"></i>
              </Link>
              <Link
                className="icon-02"
                target="_blank"
                href="https://www.instagram.com/"
              >
                <i className="icon-instagram"></i>
              </Link>
              <Link
                className="icon-03"
                target="_blank"
                href="https://twitter.com/"
              >
                <i className="icon-twitter-x"></i>
              </Link>
              <Link
                className="icon-04"
                target="_blank"
                href="https://www.linkedin.com/"
              >
                <i className="icon-linkedin"></i>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeamElementOne;

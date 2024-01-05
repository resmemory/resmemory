--더미데이터 생성
--필요한 만큼 복제하고 변경하세요.

--회원 추가
INSERT INTO Users (email, nickname, password, createdAt, updatedAt, deletedAt, kakaoId)
VALUES ("first@user.com", "firstuser","$2b$10$j2ttScQDbV17xcrnldH8BuDGhRI3WtvydDhe7oJiq6vSCy6a4Pno2", "2024-01-01 00:00:00","2024-01-01 00:00:00", null, null )

--게시글 추가
INSERT INTO Posts ( userId, title,content, img,annualCategory, createdAt, updatedAt, deletedAt, notice, thumbnail )
VALUES(1, "test", "test", "https://gthen.s3.ap-northeast-2.amazonaws.com/1704335641572_6139dd3798418a9639f846f00","1980", "2024-01-01 00:00:00", "2024-01-01 00:00:00", null, null, "https://gthen.s3.ap-northeast-2.amazonaws.com/1704335642128_6139dd3798418a9639f846f00")

--신고 추가
INSERT INTO Reports (userId, reportType, contentId, content, isReport, createdAt)
VALUES(1, "post", 1,"욕설 금지",true, "2024-01-01 00:00:00")
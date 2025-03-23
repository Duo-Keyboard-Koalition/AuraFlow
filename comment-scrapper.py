import os
from googleapiclient.discovery import build
from dotenv import load_dotenv


def initialize_youtube_api():
    api_key = "AIzaSyDqndbVj-x6mGty5O26Azy6Hsavvr8a2zw"
    # Initialize YouTube API client
    return build("youtube", "v3", developerKey=api_key)


def get_channel_id(channel_handle):
    youtube = initialize_youtube_api()
    # Make the request to search for the channel using the handle
    request = youtube.search().list(
        part="snippet",
        q=channel_handle,
        type="channel",
        maxResults=1
    )
    response = request.execute()
    if not response.get('items'):
        print(f"No channel found for handle: {channel_handle}")
        return None
    return response["items"][0]["snippet"]["channelId"]


def get_video_links(channel_id, max_results=10):
    youtube = initialize_youtube_api()
    # Make the request to fetch video links
    request = youtube.search().list(
        part="snippet",
        channelId=channel_id,
        type="video",
        maxResults=max_results
    )
    response = request.execute()
    # Extract video links and IDs
    video_links_and_ids = []
    if response.get('items'):
        for item in response['items']:
            video_id = item['id']['videoId']
            video_title = item['snippet']['title']
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            video_links_and_ids.append({"id": video_id, "title": video_title, "url": video_url})
    return video_links_and_ids


def get_all_video_comments(video_id, video_title, folder="comments"):
    youtube = initialize_youtube_api()
    comments = []
    next_page_token = None

    try:
        while True:
            request = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                pageToken=next_page_token
            )
            response = request.execute()

            # Extract comments
            for item in response.get('items', []):
                comment = item['snippet']['topLevelComment']['snippet']['textOriginal']
                comments.append(comment)

            # Check for next page
            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break
    except Exception as e:
        print(f"Error fetching comments for video {video_id}: {str(e)}")

    return comments


def save_comments_to_channel_file(channel_handle, video_data, comments_data, base_folder="comments"):
    # Create a folder for the channel
    channel_folder = os.path.join(base_folder, channel_handle)
    if not os.path.exists(channel_folder):
        os.makedirs(channel_folder)

    # Create a master file with all comments
    master_file_path = os.path.join(channel_folder, f"{channel_handle}_all_comments.txt")
    with open(master_file_path, "w", encoding="utf-8") as master_file:
        master_file.write(f"All comments for channel: {channel_handle}\n\n")

        for video_info, comments in zip(video_data, comments_data):
            video_id = video_info["id"]
            video_title = video_info["title"]

            # Write video information
            master_file.write(f"=== Video: {video_title} ===\n")
            master_file.write(f"ID: {video_id}\n")
            master_file.write(f"URL: {video_info['url']}\n")
            master_file.write(f"Comments: {len(comments)}\n\n")

            # Write all comments for this video
            for i, comment in enumerate(comments):
                master_file.write(f"Comment #{i + 1}:\n{comment}\n\n")

            master_file.write("-" * 80 + "\n\n")

            # Also save individual video files
            video_file_path = os.path.join(channel_folder, f"{video_id}.txt")
            with open(video_file_path, "w", encoding="utf-8") as video_file:
                video_file.write(f"Video Title: {video_title}\n")
                video_file.write(f"Video ID: {video_id}\n")
                video_file.write(f"Video URL: {video_info['url']}\n\n")
                for comment in comments:
                    video_file.write(comment + "\n\n")

    return master_file_path


def process_channel_videos(channel_handle, max_videos=10, comments_folder="comments"):
    # Get channel ID
    channel_id = get_channel_id(channel_handle)
    if not channel_id:
        return False

    # Get video details
    videos = get_video_links(channel_id, max_videos)
    if not videos:
        print(f"No videos found for channel: {channel_handle}")
        return False

    # Process each video
    all_video_data = []
    all_comments_data = []

    for i, video in enumerate(videos):
        print(f"Processing video {i + 1}/{len(videos)}: {video['title']}")
        comments = get_all_video_comments(video['id'], video['title'], comments_folder)
        print(f"  - Found {len(comments)} comments")

        all_video_data.append(video)
        all_comments_data.append(comments)

    # Save all comments organized by channel
    master_file = save_comments_to_channel_file(channel_handle, all_video_data, all_comments_data, comments_folder)
    print(f"All comments saved to: {master_file}")

    return True



channel_handle = "ALifeEngineered"  # Replace with your target channel
output_folder = "comments"  # Folder to save comments
max_videos = 10  # Maximum number of videos to process

success = process_channel_videos(channel_handle, max_videos, output_folder)

if success:
    print(f"Successfully processed videos for channel: {channel_handle}")
else:
    print(f"Failed to process videos for channel: {channel_handle}")
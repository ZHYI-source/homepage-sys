<template>
  <!-- Contenedor Principal -->
  <div class="comments-container">
    <a-comment>
      <template #actions>
        <span key="comment-nested-reply-to">Reply to</span>
      </template>
      <template #author>
        <a>Han Solo<span class="author">author</span></a>
      </template>
      <template #avatar>
        <a-avatar
            src="https://media.istockphoto.com/id/1212960962/photo/young-handsome-man-with-beard-wearing-casual-sweater-and-glasses-over-blue-background.jpg?b=1&s=612x612&w=0&k=20&c=rZlN3VNCI9ooc089jKRDqeGjPPjDabGlGARLPhpyO_s="
            alt="Han Solo"/>
      </template>
      <template #content>
        <p>
          We supply a series of design principles, practical patterns and high quality design
          resources (Sketch and Axure).
        </p>
      </template>
      <a-comment>
        <template #actions>
          <span>Reply to</span>
        </template>
        <template #author>
          <a>Han Solo</a>
        </template>
        <template #avatar>
          <a-avatar
              src="https://media.istockphoto.com/id/1212960962/photo/young-handsome-man-with-beard-wearing-casual-sweater-and-glasses-over-blue-background.jpg?b=1&s=612x612&w=0&k=20&c=rZlN3VNCI9ooc089jKRDqeGjPPjDabGlGARLPhpyO_s="
              alt="Han Solo"/>
        </template>
        <template #content>
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure).
          </p>
        </template>
        <a-comment>
          <template #actions>
            <span>Reply to</span>
          </template>
          <template #author>
            <a>Han Solo</a>
          </template>
          <template #avatar>
            <a-avatar
                src="https://media.istockphoto.com/id/1212960962/photo/young-handsome-man-with-beard-wearing-casual-sweater-and-glasses-over-blue-background.jpg?b=1&s=612x612&w=0&k=20&c=rZlN3VNCI9ooc089jKRDqeGjPPjDabGlGARLPhpyO_s="
                alt="Han Solo"/>
          </template>
          <template #content>
            <p>
              We supply a series of design principles, practical patterns and high quality design
              resources (Sketch and Axure).
            </p>
          </template>
        </a-comment>
        <a-comment>
          <template #actions>
            <span>Reply to</span>
          </template>
          <template #author>
            <a>Han Solo</a>
          </template>
          <template #avatar>
            <a-avatar
                src="https://media.istockphoto.com/id/1212960962/photo/young-handsome-man-with-beard-wearing-casual-sweater-and-glasses-over-blue-background.jpg?b=1&s=612x612&w=0&k=20&c=rZlN3VNCI9ooc089jKRDqeGjPPjDabGlGARLPhpyO_s="
                alt="Han Solo"/>
          </template>
          <template #content>
            <p>
              We supply a series of design principles, practical patterns and high quality design
              resources (Sketch and Axure).
            </p>
          </template>
        </a-comment>
      </a-comment>
    </a-comment>
  </div>
</template>

<script>
export default {
  name: "ZyComment"
}
</script>

<style lang="scss" scoped>
.author:after {
  content: 'autor';
  background: #03658c;
  color: #FFF;
  font-size: 12px;
  padding: 3px 5px;
  font-weight: 700;
  margin-left: 10px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
</style>

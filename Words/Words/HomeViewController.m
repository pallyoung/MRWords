//
//  HomeViewController.m
//  Words
//
//  Created by YeSpencer on 1/15/16.
//  Copyright © 2016 YeSpencer. All rights reserved.
//

#import "HomeViewController.h"
#import "MyBookList.h"
#import "CollectionViewCell.h"
#import "AddBookViewController.h"

@interface HomeViewController ()
@property (strong, nonatomic) MyBookList *bookList;
@property (nonatomic) bool isEditMode;
@property (nonatomic) NSMutableArray * selectedBooks;
@end

@implementation HomeViewController

static NSString * const reuseIdentifier = @"Cell";

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    //[self.bookListView registerClass:[CollectionViewCell class] forCellWithReuseIdentifier:reuseIdentifier];
    
    _addBookViewController = [self.storyboard
                              instantiateViewControllerWithIdentifier:
                              @"AddBook"];

    self.bookList = [MyBookList sharedBookList];
    _isEditMode = NO;
    UITapGestureRecognizer* recognizer;
    recognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(collectionViewTouched:)];
    recognizer.delegate = self;
    //[recognizer setCancelsTouchesInView:NO];
    [self.bookListView addGestureRecognizer:recognizer];
    }
-(void)cellLongPress:(UILongPressGestureRecognizer*)recognizer{
    if(recognizer.state == UIGestureRecognizerStateBegan){
        _isEditMode = YES;
        NSLog(@"long touch");
        _editToolBar.hidden = NO;
        _selectedBooks =[[NSMutableArray alloc]init];
        [self.bookListView reloadData];
        
    }

}
-(void)bookListViewReload{
    NSLog(@"reloaddddddddddddddd");
    [_bookListView reloadData];
}
-(void)removeBook:(NSMutableArray *) items{
    [_bookList removeBookByIndexs:items];
}
-(IBAction)goAddBookView:(id)sender{
    [self.view insertSubview:_addBookViewController.view atIndex:99];
}

- (IBAction)removeButtonTap:(id)sender {
    [self removeBook:_selectedBooks];
    [self exitEditMode];
}

- (IBAction)doneButtonTap:(id)sender {
    [self exitEditMode];
}
-(BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch{
    if(touch.view == self.bookListView){
        return YES;
    }
    return NO;
}
-(void)collectionViewTouched:(UITapGestureRecognizer *)recognizer{
    [self exitEditMode];
}
- (void) exitEditMode{
    if(_isEditMode == NO){
        return;
    }
    _isEditMode = NO;
    _editToolBar.hidden = YES;
    [self.bookListView reloadData];
}
-(id)getBookByIndex:(NSInteger) index{
    return [_bookList getBookByIndex:index];
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}


- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    //#warning Incomplete implementation, return the number of items
    return [_bookList count];
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    CollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    //设置label文字 [self getBookByIndex:indexPath.row]
    cell.label.text = [self getBookByIndex:indexPath.row];
    UILongPressGestureRecognizer* recognizer;
    // handleSwipeFrom 是偵測到手势，所要呼叫的方法
    recognizer = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(cellLongPress:)];
    // 不同的 Recognizer 有不同的实体变数
    // 例如 SwipeGesture 可以指定方向
    // 而 TapGesture 則可以指定次數
    [cell addGestureRecognizer:recognizer];
    [cell.checkBox setBackgroundImage:[UIImage imageNamed:@"checkbox_on.png"]  forState:UIControlStateSelected];
    [cell.checkBox setBackgroundImage:[UIImage imageNamed:@"checkbox_off.png"]  forState:UIControlStateNormal];
    cell.checkBox.hidden = !_isEditMode;
    cell.checkBox.selected = NO;
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    return CGSizeMake(100, 100);
}
-(UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section
{
    return UIEdgeInsetsMake(5, 5, 5, 5);
}
- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    CollectionViewCell *cell = (CollectionViewCell *)[collectionView cellForItemAtIndexPath:indexPath ];
    cell.checkBox.selected = !cell.checkBox.selected;
    if(cell.checkBox.selected){
        [_selectedBooks insertObject:[NSNumber numberWithInteger: indexPath.row ] atIndex:(0)];
    }else{
        [_selectedBooks removeObject:[NSNumber numberWithInteger: indexPath.row ]];
    }
    
    return;
}
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
